"""Add css_framework to UserSettings and Project.

Revision ID: 5a41a537932b
Revises: 3286a7588f5c
Create Date: 2023-09-20 13:48:21.944094

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a41a537932b'
down_revision = '3286a7588f5c'
branch_labels = None
depends_on = None


def upgrade():
    css_framework_enum = sa.Enum('BOOTSTRAP', 'DAISYUI', name='cssframework')
    css_framework_enum.create(op.get_bind(), checkfirst=False)

    with op.batch_alter_table('project', schema=None) as batch_op:
        batch_op.add_column(sa.Column('css_framework', css_framework_enum, server_default='BOOTSTRAP', nullable=False))

    with op.batch_alter_table('user_settings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('css_framework', css_framework_enum, server_default='BOOTSTRAP', nullable=False))


def downgrade():
    with op.batch_alter_table('user_settings', schema=None) as batch_op:
        batch_op.drop_column('css_framework')

    with op.batch_alter_table('project', schema=None) as batch_op:
        batch_op.drop_column('css_framework')

    css_framework_enum = sa.Enum(name='cssframework')
    css_framework_enum.drop(op.get_bind(), checkfirst=False)
