"""Added UserSettings

Revision ID: a740e029fe84
Revises: 9fcad92c2b7b
Create Date: 2023-09-13 01:33:11.168398

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a740e029fe84'
down_revision = '9fcad92c2b7b'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('user_settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('model_name', sa.String(), server_default='gpt-3.5-turbo', nullable=False),
    sa.Column('color_scheme', sa.Enum('LIGHT', 'DARK', 'SYSTEM', name='colorscheme'), server_default='SYSTEM', nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )

    # Data migration: Create a default UserSettings for each user
    user = sa.sql.table('user',
                 sa.sql.column('id', sa.Integer)
                 )
    user_settings = sa.sql.table('user_settings',
                          sa.sql.column('id', sa.Integer),
                          sa.sql.column('user_id', sa.Integer),
                          sa.sql.column('model_name', sa.String),
                          sa.sql.column('color_scheme', sa.Enum('LIGHT', 'DARK', 'SYSTEM', name='colorscheme'))
                          )

    connection = op.get_bind()
    for u in connection.execute(user.select()):
        connection.execute(
            user_settings.insert().values(user_id=u.id)
        )


def downgrade():
    op.drop_table('user_settings')
