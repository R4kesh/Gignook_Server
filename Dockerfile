FROM node:alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5001 

ENV MONGO_SECRET="mongodb+srv://rakeshsrks2580:GignookRakesh@cluster0.mnernsz.mongodb.net/GigNook?retryWrites=true&w=majority&appName=Cluster0"
ENV MONGO_PASSWORD=GignookRakesh
ENV SECRET='RAKESHsjwt'
ENV ADMIN_SECRET='RakeshAdminjwt'
ENV REFRESH_SECRET="RakeshRefresh"
ENV SALT=10
ENV NODEMAILER_USER="testtdemoo11111@gmail.com"
ENV NODEMAILER_PASSWORD="wikvaxsgqyebphvh"
ENV BASE_URL="http://localhost:3000"
ENV PORT='5001'
ENV ADEMAIL='admin@gmail.com'
ENV ADPASSWORD='admin123'
ENV NODE_ENV='production'
ENV S3_ACCESS_KEY="AKIASLAJZHQ3FL2IQRCV"
ENV S3_SECRET_KEY="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"
ENV S3_BUCKET_NAME="gignook"
ENV STRIPE_SECRET_KEY='sk_test_51PUtv61fQRSDPdfFREoyehZP6TOBz6gebbMvjTHdKagv4ss9bMAVCkhOMkdYWk5bLYgOJyrbGiCwxKqOH3F1WGz500IBYvm9bW' 
ENV HOST=smtp.gmail.com
ENV SERVICE=gmail
ENV EMAIL_PORT=587
ENV SECURE=true
ENV USER=rakeshsrakeshsrakesh2580@gmail.com
ENV PASS=rakeshsrakesh25802580D

CMD ["npm","run","dev"]


