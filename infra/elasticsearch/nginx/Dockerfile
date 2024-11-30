FROM nginx:latest

# Copy your Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your HTML files to the Nginx HTML directory
# COPY html/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
