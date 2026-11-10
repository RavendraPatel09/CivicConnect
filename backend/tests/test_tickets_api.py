import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_tickets_full_lifecycle():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Register a citizen
        citizen_payload = {
            "name": "Citizen Dave",
            "email": "dave.citizen@example.com",
            "password": "Password123!",
            "role": "citizen"
        }
        res_reg = await client.post("/api/v1/auth/register", json=citizen_payload)
        assert res_reg.status_code == 201
        token = res_reg.json()["tokens"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. File a civic complaint
        ticket_payload = {
            "title": "Severe Pothole on 5th Avenue and Elm",
            "description": "Deep 4-inch asphalt depression causing damage to passing commuter vehicles and bikes near school crossing.",
            "category": "roads_potholes",
            "severity": "high",
            "address": "500 5th Avenue, Metro City",
            "landmark": "Near Central High School",
            "lat": 37.7749,
            "lng": -122.4194,
            "images": ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800"]
        }
        res_ticket = await client.post("/api/v1/tickets", json=ticket_payload, headers=headers)
        assert res_ticket.status_code == 201
        ticket = res_ticket.json()
        assert ticket["id"].startswith("CC-")
        assert ticket["title"] == ticket_payload["title"]
        assert ticket["status"] in ("filed", "acknowledged")
        assert "aiTriage" in ticket
        assert ticket["aiTriage"]["priorityScore"] > 0
        assert len(ticket["timeline"]) >= 1

        ticket_id = ticket["id"]

        # 3. Get tickets list
        res_list = await client.get("/api/v1/tickets")
        assert res_list.status_code == 200
        tickets = res_list.json()
        assert any(t["id"] == ticket_id for t in tickets)

        # 4. Filter tickets by category
        res_filtered = await client.get("/api/v1/tickets?category=roads_potholes")
        assert res_filtered.status_code == 200
        assert all(t["category"] == "roads_potholes" for t in res_filtered.json())

        # 5. Upvote ticket toggle test (creator auto-upvoted to 1 on create)
        # Calling upvote toggles it off
        res_toggle_off = await client.post(f"/api/v1/tickets/{ticket_id}/upvote", headers=headers)
        assert res_toggle_off.status_code == 200
        assert res_toggle_off.json()["isUpvoted"] is False
        assert res_toggle_off.json()["upvotes"] == 0

        # Calling upvote again toggles it back on
        res_toggle_on = await client.post(f"/api/v1/tickets/{ticket_id}/upvote", headers=headers)
        assert res_toggle_on.status_code == 200
        assert res_toggle_on.json()["isUpvoted"] is True
        assert res_toggle_on.json()["upvotes"] == 1

        # 6. Register an Admin to update status and override triage
        admin_payload = {
            "name": "Admin Chief",
            "email": "chief.admin@citygov.org",
            "password": "Password123!",
            "role": "admin"
        }
        res_admin = await client.post("/api/v1/auth/register", json=admin_payload)
        assert res_admin.status_code == 201
        admin_token = res_admin.json()["tokens"]["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # 7. Update ticket status to in_progress
        status_payload = {
            "status": "in_progress",
            "notes": "Field repair crew dispatched to site."
        }
        res_status = await client.patch(
            f"/api/v1/tickets/{ticket_id}/status",
            json=status_payload,
            headers=admin_headers
        )
        assert res_status.status_code == 200
        updated_ticket = res_status.json()
        assert updated_ticket["status"] == "in_progress"
        assert len(updated_ticket["timeline"]) >= 2

        # 8. Check Analytics Summary reflects the ticket
        res_analytics = await client.get("/api/v1/analytics/summary")
        assert res_analytics.status_code == 200
        analytics = res_analytics.json()
        assert analytics["totalComplaints"] >= 1
        assert "categoryDistribution" in analytics
        assert "monthlyTrends" in analytics

        # 9. Query Municipal RAG
        rag_payload = {
            "query": "What is the standard procedure for pothole and asphalt repair?",
            "top_k": 2
        }
        res_rag = await client.post("/api/v1/documents/query", json=rag_payload)
        assert res_rag.status_code == 200
        rag_data = res_rag.json()
        assert rag_data["has_relevant_guideline"] is True
        assert len(rag_data["retrieved_documents"]) > 0
        assert "pothole" in rag_data["retrieved_documents"][0]["title"].lower()
