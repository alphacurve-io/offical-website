   npm run build
   rm build.zip
   # zip build folder
   zip -r build.zip build
   # remove build.zip remotely
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219 "rm build.zip"
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219 "rm -rf build"
   scp build.zip jamesshieh0510@35.189.163.219:~/
#    ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219
   # unzip build.zip
   #sudo apt install unzip
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219 "unzip build.zip"
   # remove build.zip
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219 "rm build.zip"
   # remove  /var/www/alphacurve.io/html
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219 "rm -rf /var/www/alphacurve.io/html/*"
   # move build to /var/www/alphacurve.io/html
   ssh -i ~/.ssh/id_rsa jamesshieh0510@35.189.163.219 "mv ~/build/* /var/www/alphacurve.io/html"
