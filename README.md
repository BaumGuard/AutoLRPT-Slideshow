# AutoLRPT-Slideshow
Slideshow for satellite images in the web browser<br />
This is an extension to my project [AutoLRPT](https://github.com/BaumGuard/AutoLRPT) which receives LRPT images from weather satellites automatically.

## Setup
### Apache web server
Since the slideshow is being served over the web, it is necessary to set up a web server such as **Apache2**. Other web servers should work as well, but I only tested it with **Apache2** so far.<br />

**Install Apache2 with PHP support**
```bash
sudo apt install apache2 php
```
**Start the web server**
```bash
sudo systemctl enable apache2
sudo systemctl start apache2
```
**Download the project and move it into the web server's directory**
```bash
git clone https://github.com/BaumGuard/AutoLRPT-Slideshow
mv AutoLRPT-Slideshow/* /var/www/html
```
**Create a folder for the compressed images**
```bash
sudo mkdir /var/www/html/images/compressed
```
**Change permissions for the image folder**
```bash
sudo ćhmod 707 -R /var/www/html/images
```

**Open the slideshow in your browser**<br />
URL:
```
<server-ip>:[server-port]
```

You should now see the slideshow page which you can use for browsing through your satellite images, filtering and deleting them.

### AutoLRPT
**AutoLRPT** leaves the satellite images in the folder into which **mlrpt** saved them by default. Since **AutoLRPT-Slideshow** only uses the folder `images` as its image source, you have to uncomment these lines at the bottom of the files `AutoLRPT_Meteor_M2-3` and `AutoLRPT_Meteor_M2-4`:
```bash
# if [[ $(ls ~/mlrpt/images) != "" ]]; then
# 	for file in $(ls -1 ~/mlrpt/images); do
# 		convert ~/mlrpt/images/$file -resize 50% -quality 10 /var/www/html/images/compressed/$file
# 	done
#
# 	mv ~/mlrpt/images/* /var/www/html/images
# fi

```

Whenever **AutoLRPT** receives satellite images now, it will move them into the directory `/var/www/html/images`
