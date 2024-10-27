# AutoLRPT-Slideshow
Slideshow for satellite images in the web browser<br />
This is an extension to my project [AutoLRPT](https://github.com/BaumGuard/AutoLRPT) which receives LRPT images from weather satellites automatically.

## Setup
### Apache web server
Since the slideshow is being served over the web, it is necessary to set up a web server such as **Apache2**. Other web servers should work as well, but I only tested it with **Apache2** so far.<br />

**Install Apache2 with PHP support**
```
sudo apt install apache2 php8.1 libapache2-mod-php8.1
```
**Start the web server**
```
sudo systemctl enable apache2
sudo systemctl start apache2
```
**Download the project and move it into the web server's folder**
```
git clone https://github.com/BaumGuard/AutoLRPT-Slideshow
mv AutoLRPT-Slideshow /var/www/html
```
*You can rename the folder `AutoLRPT-Slideshow` if you want.*

**Open the slideshow in your browser**<br />
**URL:** \<server-ip\>:\[server-port\]/AutoLRPT-Slideshow<br />

You should now see the slideshow window. If the folder `images` is empty.

### AutoLRPT
**AutoLRPT** leaves the satellite images in the folder into which **mlrpt** saved them by default. Since **AutoLRPT-Slideshow** only uses the folder `images` as its image source, you have to uncomment this line in `AutoLRPT_Meteor_M2-3` and `AutoLRPT_Meteor_M2-4`:
```Bash
#[[ $(ls ~/mlrpt/images) != "" ]] && mv ~/mlrpt/images/* /var/www/html/images
```
