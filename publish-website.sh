   npm run build
   rm build.zip
   # zip build folder
   zip -r build.zip build
   # remove build.zip remotely
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16 "rm build.zip"
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16 "rm -rf build"
   scp build.zip jamesshieh0510@35.201.233.16:~/
#    ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16
   # unzip build.zip
   #sudo apt install unzip
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16 "unzip build.zip"
   # remove build.zip
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16 "rm build.zip"
   # remove  /var/www/alphacurve.io/html
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16 "rm -rf /var/www/alphacurve.io/html/*"
   # move build to /var/www/alphacurve.io/html
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.201.233.16 "mv ~/build/* /var/www/alphacurve.io/html"
