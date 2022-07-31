#!/usr/local/bin/python3
import re
from pathlib import Path
import shutil
import os

# init
base_path = 'db'
dump_name = 'etlsheetjs.sql'
dump_path = f'{base_path}/{dump_name}' 
# dump database schema
cmd = f'pg_dump -U postgres -h localhost -d etlsheetjs -f {dump_path} -F p -s -C'

# delete previous version
if os.path.isdir(base_path):
    shutil.rmtree(base_path)

# create base path
Path(base_path).mkdir(parents=True, exist_ok=True)

# dump files
print(f'Dumping db using cmd: {cmd}')
os.system(cmd) 

# done
print('Done!')