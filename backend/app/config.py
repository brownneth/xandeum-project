import os
import logging

# CLOUD DATABASE CONFIGURATION
DATABASE_URL = "postgresql://neondb_owner:npg_ru6OEQjSMR4H@ep-aged-credit-ag03cwyn-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Network Configuration
SEED_IPS = [
    "161.97.97.41", "192.190.136.36", "192.190.136.38",
    "192.190.136.28", "192.190.136.29", "207.244.255.1"
]
RPC_PORT = 6000
POLL_INTERVAL_SECONDS = 60

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)