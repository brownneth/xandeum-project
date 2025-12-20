def format_bytes(size: int) -> str:
    """
    Converts a byte count into a human-readable string (KB, MB, GB, TB).
    Returns '0.00 B' if input is None or 0.
    """
    if not size:
        return "0.00 B"
        
    power = 2**10
    n = 0
    power_labels = {0 : '', 1: 'KB', 2: 'MB', 3: 'GB', 4: 'TB'}
    
    while size > power:
        size /= power
        n += 1
    
    return f"{size:.2f} {power_labels[n]}"