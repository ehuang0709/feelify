#!/bin/bash
exec gunicorn -b 0.0.0.0:3000 app:appbash