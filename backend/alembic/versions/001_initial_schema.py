"""001_initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-11-09 20:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Enable pgvector extension if on PostgreSQL
    conn = op.get_bind()
    if conn.dialect.name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    # 2. Departments
    op.create_table(
        'departments',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=150), unique=True, nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_departments_name', 'departments', ['name'])

    # 3. Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='citizen'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('profile_image', sa.String(length=500), nullable=True),
        sa.Column('department_id', sa.String(length=36), sa.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_users_email', 'users', ['email'])

    # 4. Tickets
    op.create_table(
        'tickets',
        sa.Column('id', sa.String(length=30), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False, server_default='medium'),
        sa.Column('priority_score', sa.Integer(), nullable=False, server_default='50'),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='filed'),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('address', sa.Text(), nullable=False),
        sa.Column('landmark', sa.String(length=255), nullable=True),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('ai_summary', sa.Text(), nullable=True),
        sa.Column('ai_response', sa.Text(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=False, server_default='0.90'),
        sa.Column('is_overridden', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('overridden_by', sa.String(length=100), nullable=True),
        sa.Column('overridden_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('override_notes', sa.Text(), nullable=True),
        sa.Column('department_id', sa.String(length=36), sa.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True),
        sa.Column('assigned_staff_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('duplicate_of_ticket_id', sa.String(length=30), sa.ForeignKey('tickets.id', ondelete='SET NULL'), nullable=True),
        sa.Column('upvotes_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_tickets_user_id', 'tickets', ['user_id'])
    op.create_index('ix_tickets_category', 'tickets', ['category'])
    op.create_index('ix_tickets_status', 'tickets', ['status'])
    op.create_index('ix_tickets_priority_score', 'tickets', ['priority_score'])
    op.create_index('ix_tickets_created_at', 'tickets', ['created_at'])

    # 5. Ticket Events
    op.create_table(
        'ticket_events',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('ticket_id', sa.String(length=30), sa.ForeignKey('tickets.id', ondelete='CASCADE'), nullable=False),
        sa.Column('actor_id', sa.String(length=36), nullable=True),
        sa.Column('actor_name', sa.String(length=100), nullable=False, server_default='System'),
        sa.Column('actor_role', sa.String(length=50), nullable=False, server_default='System'),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('previous_status', sa.String(length=50), nullable=True),
        sa.Column('new_status', sa.String(length=50), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_ticket_events_ticket_id', 'ticket_events', ['ticket_id'])

    # 6. Upvotes
    op.create_table(
        'upvotes',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('ticket_id', sa.String(length=30), sa.ForeignKey('tickets.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('ticket_id', 'user_id', name='uq_ticket_user_upvote'),
    )

    # 7. Notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('ticket_id', sa.String(length=30), sa.ForeignKey('tickets.id', ondelete='SET NULL'), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('notification_type', sa.String(length=50), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])
    op.create_index('ix_notifications_is_read', 'notifications', ['is_read'])

    # 8. Ticket Embeddings (Using Vector(768) if postgres, or Text if sqlite)
    embedding_col = sa.Column('embedding', Vector(768), nullable=False) if conn.dialect.name == "postgresql" else sa.Column('embedding', sa.Text(), nullable=False)
    op.create_table(
        'ticket_embeddings',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('ticket_id', sa.String(length=30), sa.ForeignKey('tickets.id', ondelete='CASCADE'), unique=True, nullable=False),
        embedding_col,
        sa.Column('model_name', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # 9. Municipal Documents (RAG)
    doc_embedding_col = sa.Column('embedding', Vector(768), nullable=True) if conn.dialect.name == "postgresql" else sa.Column('embedding', sa.Text(), nullable=True)
    op.create_table(
        'documents',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('document_type', sa.String(length=100), nullable=False, server_default='guideline'),
        sa.Column('source', sa.String(length=255), nullable=True),
        doc_embedding_col,
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # 10. Refresh Tokens
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token_hash', sa.String(length=255), unique=True, nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_refresh_tokens_token_hash', 'refresh_tokens', ['token_hash'])

    # 11. Staff Assignments
    op.create_table(
        'staff_assignments',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('ticket_id', sa.String(length=30), sa.ForeignKey('tickets.id', ondelete='CASCADE'), nullable=False),
        sa.Column('staff_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assigned_by', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assigned_at', sa.DateTime(timezone=True), nullable=False),
    )

def downgrade() -> None:
    op.drop_table('staff_assignments')
    op.drop_table('refresh_tokens')
    op.drop_table('documents')
    op.drop_table('ticket_embeddings')
    op.drop_table('notifications')
    op.drop_table('upvotes')
    op.drop_table('ticket_events')
    op.drop_table('tickets')
    op.drop_table('users')
    op.drop_table('departments')
