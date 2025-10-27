#!/bin/bash

# FadSMS Frontend Deployment Script
# This script helps deploy frontend changes from local development to server

set -e  # Exit on any error

# Configuration
FRONTEND_DIR="/var/www/fadsms.com"
BACKUP_DIR="/var/www/backups/fadsms.com"
LOG_FILE="/var/log/fadsms-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create backup directory if it doesn't exist
create_backup() {
    log "Creating backup of current frontend..."
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$FRONTEND_DIR" ]; then
        cp -r "$FRONTEND_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    else
        warning "No existing frontend directory to backup"
    fi
}

# Deploy from git repository
deploy_from_git() {
    log "Deploying from Git repository..."
    
    if [ ! -d "$FRONTEND_DIR/.git" ]; then
        error "Git repository not found in $FRONTEND_DIR"
        return 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Pull latest changes
    log "Pulling latest changes from Git..."
    git pull origin main || git pull origin master
    
    # If there's a build process, run it
    if [ -f "package.json" ]; then
        log "Running build process..."
        if command -v npm &> /dev/null; then
            npm install
            npm run build
        elif command -v yarn &> /dev/null; then
            yarn install
            yarn build
        else
            warning "No package manager found (npm/yarn)"
        fi
    fi
    
    success "Deployment from Git completed"
}

# Deploy from uploaded files
deploy_from_upload() {
    local upload_dir="$1"
    
    if [ -z "$upload_dir" ] || [ ! -d "$upload_dir" ]; then
        error "Upload directory not specified or doesn't exist: $upload_dir"
        return 1
    fi
    
    log "Deploying from upload directory: $upload_dir"
    
    # Copy files to frontend directory
    rsync -av --delete "$upload_dir/" "$FRONTEND_DIR/"
    
    success "Deployment from upload completed"
}

# Set proper permissions
set_permissions() {
    log "Setting proper permissions..."
    chown -R www-data:www-data "$FRONTEND_DIR"
    chmod -R 755 "$FRONTEND_DIR"
    find "$FRONTEND_DIR" -type f -name "*.html" -exec chmod 644 {} \;
    find "$FRONTEND_DIR" -type f -name "*.css" -exec chmod 644 {} \;
    find "$FRONTEND_DIR" -type f -name "*.js" -exec chmod 644 {} \;
    success "Permissions set"
}

# Main deployment function
main() {
    log "Starting FadSMS Frontend Deployment..."
    
    case "$1" in
        "git")
            create_backup
            deploy_from_git
            set_permissions
            ;;
        "upload")
            create_backup
            deploy_from_upload "$2"
            set_permissions
            ;;
        "backup")
            create_backup
            ;;
        "permissions")
            set_permissions
            ;;
        *)
            echo "Usage: $0 {git|upload <directory>|backup|permissions}"
            echo ""
            echo "Commands:"
            echo "  git                    - Deploy from Git repository"
            echo "  upload <directory>     - Deploy from uploaded directory"
            echo "  backup                 - Create backup only"
            echo "  permissions            - Fix permissions only"
            exit 1
            ;;
    esac
    
    success "Deployment completed successfully!"
}

# Run main function with all arguments
main "$@"
