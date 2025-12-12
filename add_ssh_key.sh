#!/bin/bash

# Remote server details
REMOTE_USER="jamesshieh0510"
REMOTE_HOST="35.189.163.219"
PUBLIC_KEY="$HOME/.ssh/id_rsa.pub"

echo "Checking for public key at $PUBLIC_KEY..."

# Check if public key exists, if not generate it
if [ ! -f "$PUBLIC_KEY" ]; then
    echo "Public key not found. Generating a new SSH key pair..."
    # Generate SSH key (no passphrase for automation, but user can change this)
    ssh-keygen -t rsa -b 4096 -f "$HOME/.ssh/id_rsa" -N ""
    echo "SSH key generated."
else
    echo "Public key found."
fi

echo "Attempting to copy SSH key to $REMOTE_USER@$REMOTE_HOST..."
echo "NOTE: You will be asked for the remote user's password if password authentication is enabled."

# Use ssh-copy-id to add the key
ssh-copy-id -i "$PUBLIC_KEY" "$REMOTE_USER@$REMOTE_HOST"

if [ $? -eq 0 ]; then
    echo "----------------------------------------"
    echo "Success! The key has been added."
    echo "You can now try logging in with:"
    echo "ssh $REMOTE_USER@$REMOTE_HOST"
    echo "----------------------------------------"
else
    echo "----------------------------------------"
    echo "Error: Failed to copy the ID."
    echo "If you got 'Permission denied', it means either:"
    echo "1. Password authentication is disabled on the server."
    echo "2. You entered the wrong password."
    echo ""
    echo "If this is a Google Cloud (GCP) instance, you might need to add the SSH key via the GCP Console metadata."
    echo "Public Key Content (copy this to GCP Console if needed):"
    cat "$PUBLIC_KEY"
    echo "----------------------------------------"
fi
