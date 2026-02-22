#!/bin/bash
# Google Drive file operations
# Usage: ./google-drive.sh list_files "folder_id"
# Usage: ./google-drive.sh upload_file "/path/to/file" "folder_id"
# Usage: ./google-drive.sh create_folder "Folder Name" "parent_folder_id"
# Usage: ./google-drive.sh search "filename query"

set -euo pipefail

ACTION="${1:?Usage: google-drive.sh <action> [args...]}"
shift

case "$ACTION" in
  list_files)
    FOLDER_ID="$1"
    curl -s "https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&fields=files(id,name,mimeType,modifiedTime)&orderBy=modifiedTime+desc" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}"
    ;;
  upload_file)
    FILE_PATH="$1"
    FOLDER_ID="$2"
    FILENAME=$(basename "$FILE_PATH")
    curl -s -X POST "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
      -F "metadata={\"name\":\"${FILENAME}\",\"parents\":[\"${FOLDER_ID}\"]};type=application/json" \
      -F "file=@${FILE_PATH}"
    ;;
  create_folder)
    NAME="$1"
    PARENT="${2:-root}"
    curl -s -X POST "https://www.googleapis.com/drive/v3/files" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"name\":\"${NAME}\",\"mimeType\":\"application/vnd.google-apps.folder\",\"parents\":[\"${PARENT}\"]}"
    ;;
  search)
    QUERY="$1"
    curl -s "https://www.googleapis.com/drive/v3/files?q=name+contains+'${QUERY}'&fields=files(id,name,mimeType,modifiedTime)" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: list_files, upload_file, create_folder, search"
    exit 1
    ;;
esac
