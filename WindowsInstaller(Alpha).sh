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
cd C:\
 #Cd's the Home Directory
if [ -d "ProjectVoyager" ]
#Checks If ProjectVoyager is Installed
then
#If Installed Run
    cd C:\ProjectVoyager
    npm start 
else
#If Not Install
	echo "Project Voyager is not Installed"    
    echo "Press The [ENTER] Key To Install."
    read -p "$*"
	echo "WARNING: MAKE SURE YOU HAVE THE REQUIRED PROGRAMS (Git, and Node.js)"
	echo "Press [ENTER] to Continue."
	read -p "S*"
    echo "Installing....."
	cd C:\
	
    git clone https://github.com/TotalChris/ProjectVoyager.git
    cd ProjectVoyager
    npm i
    echo "Thank You For Installing Voyager!"
    cd C:\
    
	cd ProjectVoyager\
    npm start
	sleep 1
fi

