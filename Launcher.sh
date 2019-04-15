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
cd ~
if [ -d "ProjectVoyager" ]
then
    cd ProjectVoyager
    sudo npm start 
else
    echo "Project Voyager is not Installed"    
    echo "Press The [ENTER] Key To Install."
    read -p "$*"
    echo "Installing....."         
    git clone https://github.com/TotalChris/ProjectVoyager.git
    sudo apt install npm
    cd ProjectVoyager
    sudo npm i
    echo "Thank You For Installing Voyager!"
    cd ~
    cd ProjectVoyager
    sudo npm start
fi

