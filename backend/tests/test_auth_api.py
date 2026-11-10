import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_register_and_login_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Register new citizen
        reg_payload = {
            "name": "Jane Citizen",
            "email": "jane.citizen@example.com",
            "password": "Password123!",
            "role": "citizen"
        }
        res = await client.post("/api/v1/auth/register", json=reg_payload)
        assert res.status_code == 201
        data = res.json()
        assert data["user"]["email"] == "jane.citizen@example.com"
        assert data["user"]["role"] == "citizen"
        assert "token" in data
        assert "tokens" in data
        access_token = data["tokens"]["access_token"]
        refresh_token = data["tokens"]["refresh_token"]

        # 2. Duplicate registration fails
        res_dup = await client.post("/api/v1/auth/register", json=reg_payload)
        assert res_dup.status_code == 400
        assert "already exists" in res_dup.json()["detail"].lower()

        # 3. Login with correct password
        login_payload = {
            "email": "jane.citizen@example.com",
            "password": "Password123!"
        }
        res_login = await client.post("/api/v1/auth/login", json=login_payload)
        assert res_login.status_code == 200
        login_data = res_login.json()
        assert login_data["user"]["name"] == "Jane Citizen"
        assert "token" in login_data
        new_access_token = login_data["tokens"]["access_token"]
        new_refresh_token = login_data["tokens"]["refresh_token"]

        # 4. Login with bad password fails
        bad_login = {
            "email": "jane.citizen@example.com",
            "password": "WrongPassword999!"
        }
        res_bad = await client.post("/api/v1/auth/login", json=bad_login)
        assert res_bad.status_code == 401

        # 5. Access /me with Bearer token
        headers = {"Authorization": f"Bearer {new_access_token}"}
        res_me = await client.get("/api/v1/auth/me", headers=headers)
        assert res_me.status_code == 200
        me_data = res_me.json()
        assert me_data["email"] == "jane.citizen@example.com"
        assert me_data["role"] == "citizen"

        # 6. Access /me without token fails
        res_no_token = await client.get("/api/v1/auth/me")
        assert res_no_token.status_code == 401

        # 7. Refresh token rotation
        res_refresh = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": new_refresh_token}
        )
        assert res_refresh.status_code == 200
        refresh_data = res_refresh.json()
        assert "access_token" in refresh_data
        assert "refresh_token" in refresh_data
        rotated_refresh = refresh_data["refresh_token"]

        # 8. Attempting to reuse old refresh token fails (Token revocation)
        res_reuse = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": new_refresh_token}
        )
        assert res_reuse.status_code == 401

        # 9. Logout
        res_logout = await client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {refresh_data['access_token']}"}
        )
        assert res_logout.status_code == 200

        # 10. Once logged out, the rotated refresh token is revoked
        res_revoked = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": rotated_refresh}
        )
        assert res_revoked.status_code == 401

@pytest.mark.asyncio
async def test_forgot_and_reset_password_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Register user
        reg_payload = {
            "name": "Reset Test User",
            "email": "reset.user@example.com",
            "password": "InitialPassword123!",
            "role": "citizen"
        }
        reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
        assert reg_res.status_code == 201

        # Forgot password request
        forgot_res = await client.post("/api/v1/auth/forgot-password", json={"email": "reset.user@example.com"})
        assert forgot_res.status_code == 200
        reset_token = forgot_res.json().get("reset_token")
        assert reset_token is not None

        # Reset password
        reset_res = await client.post(
            "/api/v1/auth/reset-password",
            json={"token": reset_token, "new_password": "NewSecurePassword456!"}
        )
        assert reset_res.status_code == 200

        # Login with old password fails
        old_login = await client.post(
            "/api/v1/auth/login",
            json={"email": "reset.user@example.com", "password": "InitialPassword123!"}
        )
        assert old_login.status_code == 401

        # Login with new password succeeds
        new_login = await client.post(
            "/api/v1/auth/login",
            json={"email": "reset.user@example.com", "password": "NewSecurePassword456!"}
        )
        assert new_login.status_code == 200
