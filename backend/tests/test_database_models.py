import pytest
import pytest_asyncio
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.database import Base
from app.models import (
    User,
    UserRole,
    Department,
    Ticket,
    ComplaintCategory,
    ComplaintSeverity,
    ComplaintStatus,
    TicketEvent,
    Upvote,
    Notification,
    NotificationType,
    RefreshToken,
)
from app.core.security import get_password_hash, verify_password, create_refresh_token, hash_token

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def async_session():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        yield session
        
    await engine.dispose()

@pytest.mark.asyncio
async def test_argon2_password_hashing():
    plain = "SecurePassword123!"
    hashed = get_password_hash(plain)
    
    assert hashed != plain
    assert hashed.startswith("$argon2")
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

@pytest.mark.asyncio
async def test_create_user_and_department(async_session: AsyncSession):
    dept = Department(name="Department of Transportation & Roads", description="Handles road repairs")
    async_session.add(dept)
    await async_session.commit()
    await async_session.refresh(dept)
    
    user = User(
        name="Elena Rostova",
        email="elena.rostova@example.com",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.CITIZEN,
        department_id=dept.id
    )
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    
    assert user.id is not None
    assert user.name == "Elena Rostova"
    assert user.role == UserRole.CITIZEN
    assert user.department.name == "Department of Transportation & Roads"

@pytest.mark.asyncio
async def test_create_ticket_with_events(async_session: AsyncSession):
    user = User(
        name="Citizen User",
        email="citizen@example.com",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.CITIZEN
    )
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    
    ticket = Ticket(
        id="CC-2025-0001",
        user_id=user.id,
        title="Pothole on Main Street",
        description="Dangerous road crater causing traffic disruption.",
        category=ComplaintCategory.ROADS_POTHOLES,
        severity=ComplaintSeverity.HIGH,
        priority_score=85,
        status=ComplaintStatus.FILED,
        latitude=37.7749,
        longitude=-122.4194,
        address="100 Main Street",
    )
    async_session.add(ticket)
    await async_session.commit()
    
    event = TicketEvent(
        ticket_id=ticket.id,
        actor_id=user.id,
        actor_name=user.name,
        actor_role="Citizen",
        event_type="created",
        title="Report Filed",
        note="Initial citizen report"
    )
    async_session.add(event)
    await async_session.commit()
    
    res = await async_session.execute(select(Ticket).where(Ticket.id == "CC-2025-0001"))
    saved_ticket = res.scalar_one()
    
    assert saved_ticket.title == "Pothole on Main Street"
    assert len(saved_ticket.events) == 1
    assert saved_ticket.events[0].title == "Report Filed"

@pytest.mark.asyncio
async def test_upvote_unique_constraint(async_session: AsyncSession):
    user = User(
        name="Upvoter",
        email="upvoter@example.com",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.CITIZEN
    )
    async_session.add(user)
    await async_session.commit()
    
    ticket = Ticket(
        id="CC-2025-0002",
        user_id=user.id,
        title="Water Leak",
        description="Pipe leaking on sidewalk.",
        category=ComplaintCategory.WATER_SUPPLY,
        latitude=37.78,
        longitude=-122.42,
        address="5th Ave"
    )
    async_session.add(ticket)
    await async_session.commit()
    
    upvote1 = Upvote(ticket_id=ticket.id, user_id=user.id)
    async_session.add(upvote1)
    await async_session.commit()
    
    # Second upvote from same user on same ticket must raise IntegrityError
    upvote2 = Upvote(ticket_id=ticket.id, user_id=user.id)
    async_session.add(upvote2)
    with pytest.raises(IntegrityError):
        await async_session.commit()

@pytest.mark.asyncio
async def test_refresh_token_rotation_model(async_session: AsyncSession):
    user = User(
        name="Token User",
        email="token@example.com",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.CITIZEN
    )
    async_session.add(user)
    await async_session.commit()
    
    raw_token, token_hash, expires_at = create_refresh_token()
    rt = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    async_session.add(rt)
    await async_session.commit()
    
    # Verify token hash matching
    assert hash_token(raw_token) == token_hash
    assert rt.revoked_at is None
    
    # Revoke token
    rt.revoked_at = datetime.now(timezone.utc)
    await async_session.commit()
    await async_session.refresh(rt)
    assert rt.revoked_at is not None
