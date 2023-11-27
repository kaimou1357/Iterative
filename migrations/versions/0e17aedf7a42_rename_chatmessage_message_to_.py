"""Rename ChatMessage.message to ChatMessage.content

Revision ID: 0e17aedf7a42
Revises: 0ea491aafef3
Create Date: 2023-09-11 22:24:21.831131

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0e17aedf7a42'
down_revision = '0ea491aafef3'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('chat_message', schema=None) as batch_op:
        batch_op.alter_column('message', new_column_name='content')


def downgrade():
    with op.batch_alter_table('chat_message', schema=None) as batch_op:
        batch_op.alter_column('content', new_column_name='message')
