import os
import logging

# CLOUD DATABASE CONFIGURATION
DATABASE_URL = "postgresql://neondb_owner:npg_ru6OEQjSMR4H@ep-aged-credit-ag03cwyn-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Network Configuration
SEED_IPS = [
    "173.212.220.65",  
    "173.212.207.32",
    "173.249.54.191",
    "167.86.123.82",
    "152.53.236.91",
    "144.91.90.185"
]
RPC_PORT = 6000
POLL_INTERVAL_SECONDS = 60

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)