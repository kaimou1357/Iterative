"""Updated model_name to use AssistantModel Enum

Revision ID: abd7a8e2347e
Revises: 5a41a537932b
Create Date: 2023-09-22 02:18:24.840099

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'abd7a8e2347e'
down_revision = '5a41a537932b'
branch_labels = None
depends_on = None


def upgrade():
    assistant_model_enum = sa.Enum('GPT_3_5_TURBO', 'GPT_3_5_TURBO_16K', 'GPT_4', name='assistantmodel')
    assistant_model_enum.create(op.get_bind(), checkfirst=False)

    op.execute("UPDATE user_settings SET model_name = 'GPT_3_5_TURBO' WHERE model_name = 'gpt-3.5-turbo'")
    op.execute("UPDATE user_settings SET model_name = 'GPT_3_5_TURBO_16K' WHERE model_name = 'gpt-3.5-turbo-16k'")
    op.execute("UPDATE user_settings SET model_name = 'GPT_4' WHERE model_name = 'gpt-4'")
    
    op.execute("UPDATE chat_message SET model_name = 'GPT_3_5_TURBO' WHERE model_name = 'gpt-3.5-turbo'")
    op.execute("UPDATE chat_message SET model_name = 'GPT_3_5_TURBO_16K' WHERE model_name = 'gpt-3.5-turbo-16k'")
    op.execute("UPDATE chat_message SET model_name = 'GPT_4' WHERE model_name = 'gpt-4'")

     # Alter the chat_message table
    with op.batch_alter_table('chat_message', schema=None) as batch_op:
        batch_op.alter_column('model_name',
               existing_type=sa.VARCHAR(),
               type_=assistant_model_enum,
               postgresql_using='model_name::assistantmodel',
               existing_nullable=True)

    # Remove the default value from the user_settings table
    op.alter_column('user_settings', 'model_name', server_default=None)
    
    # Alter the user_settings table
    with op.batch_alter_table('user_settings', schema=None) as batch_op:
        batch_op.alter_column('model_name',
               existing_type=sa.VARCHAR(),
               type_=assistant_model_enum,
               postgresql_using='model_name::assistantmodel',
               existing_nullable=False)

    # Re-add the default value to one of the enum values
    op.alter_column('user_settings', 'model_name', server_default="GPT_3_5_TURBO")


def downgrade():
    assistant_model_enum = sa.Enum(name='assistantmodel')

    # Remove the default value from the user_settings table
    op.alter_column('user_settings', 'model_name', server_default=None)

    with op.batch_alter_table('user_settings', schema=None) as batch_op:
        batch_op.alter_column('model_name',
               existing_type=assistant_model_enum,
               type_=sa.VARCHAR(),
               existing_nullable=False)
        
    # Re-add the original default value
    op.alter_column('user_settings', 'model_name', server_default="gpt-3.5-turbo")

    with op.batch_alter_table('chat_message', schema=None) as batch_op:
        batch_op.alter_column('model_name',
               existing_type=assistant_model_enum,
               type_=sa.VARCHAR(),
               existing_nullable=True)

    op.execute("UPDATE user_settings SET model_name = 'gpt-3.5-turbo' WHERE model_name = 'GPT_3_5_TURBO'")
    op.execute("UPDATE user_settings SET model_name = 'gpt-3.5-turbo-16k' WHERE model_name = 'GPT_3_5_TURBO_16K'")
    op.execute("UPDATE user_settings SET model_name = 'gpt-4' WHERE model_name = 'GPT_4'")
    
    op.execute("UPDATE chat_message SET model_name = 'gpt-3.5-turbo' WHERE model_name = 'GPT_3_5_TURBO'")
    op.execute("UPDATE chat_message SET model_name = 'gpt-3.5-turbo-16k' WHERE model_name = 'GPT_3_5_TURBO_16K'")
    op.execute("UPDATE chat_message SET model_name = 'gpt-4' WHERE model_name = 'GPT_4'")

    assistant_model_enum.drop(op.get_bind(), checkfirst=False)