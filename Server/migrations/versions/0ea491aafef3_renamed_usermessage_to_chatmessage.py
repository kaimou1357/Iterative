"""Renamed UserMessage to ChatMessage

Revision ID: 0ea491aafef3
Revises: f9310f58d35b
Create Date: 2023-09-11 00:58:03.567147

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0ea491aafef3'
down_revision = 'f9310f58d35b'
branch_labels = None
depends_on = None


def upgrade():
    op.rename_table('user_message', 'chat_message')

def downgrade():
    op.rename_table('chat_message', 'user_message')
