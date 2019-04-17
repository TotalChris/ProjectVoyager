#Launcher By: Larvey
#Project Voyager By: Total Chris
echo -ne '-->                       (05%)\r'
sleep .5
echo -ne '---->                     (10%)\r'
sleep .2
echo -ne '------>                   (20%)\r'
sleep .15
echo -ne '--------->                (30%)\r'
sleep .1
echo -ne '-------------->           (40%)\r'
sleep .1
echo -ne '------------------>       (50%)\r'
sleep .1
echo -ne '----------------------->  (80%)\r'
sleep .1
echo -ne '------------------------->(99%)\r'
sleep .1
echo -ne '-------------------------X(100%)\r'
echo -ne '\n'
#Loading Bar ^
cd ~ #Cd's the Home Directory
if [ -d "ProjectVoyager" ]
#Checks If ProjectVoyager is Installed
then
#If Installed Run
    cd ProjectVoyager
    sudo npm start 
else
#If Not Install
    echo "Project Voyager is not Installed"    
    echo "Press The [ENTER] Key To Install."
    read -p "$*"
    echo "Installing....."
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"         
    git clone https://github.com/TotalChris/ProjectVoyager.git
    brew install npm
    sudo npm install electron -g
    cd ProjectVoyager
    sudo npm config set unsafe-perm true
    sudo npm i
    echo "Thank You For Installing Voyager!"
    cd ~
    cd ProjectVoyager
    sudo npm start
fi

