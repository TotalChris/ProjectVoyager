# Project Voyager
A new and universal file manager built for the way you work.

* Feedback: siftdevelopment@gmail.com
* Telegram: [t.me/ProjectVoyager](t.me/ProjectVoyager])
* Donate: [paypal.me/siftware](paypal.me/siftware)
(Please donate if you can, it really helps.)

***
**Project Goal**

Develop the world's most powerful and easiest-to-use file manager in a cross-platform environment
***
**Development Screenshots**

![Dark Mode](https://github.com/TotalChris/ProjectVoyager/bin/scr/dark.png "Voyager in a beautiful dark mode")

***
**Building From Source**

To build the current version of Project Voyager, make sure you have these prerequisites installed via your platform's command line:

* node/npm
* git

Then, run:

```
git clone https://github.com/TotalChris/ProjectVoyager.git
```

Next, cd into 'ProjectVoyager' and run:

```
npm i
```

After dependencies have been installed, run Voyager with:

```
npm start
```
***
**Usage**

You can exit the window at any time by normal means, including from the command line itself (Ctrl + C), should the window freeze or the controls break.

The best way to navigate files as of right now is to use the text bar to type in a path. You can also use the folder navigation system, but this functionality is currently under construction

***
**Known Issues**

* If you attempt to access a folder that your host does not allow access to, voyager will instantly throw an error.

* When starting, Voyager looks for the root ('/') directory by default. Trying to access files using this prefix on Windows (And possibly OSx, untested) will throw an error. A platform-specific compatibility patch is being worked on.

* ~~If Voyager cannot access a file, or throws an error on opening something, the value of the file or folder is still added to the address bar. This will make any subsequent navigation fail because the path will not exist. Detection methods are being tested.~~ Issue Fixed, will update readme soon.

***
**Final Words**

If you wish to contribute to Voyager, feel free to do so. I've recently made the code public so anyone can read it or test it. If I manage to get back to you on an issue or pull request, consider yourself lucky. Git is something I'm still learning, and being a teenager still in high school, I never have as much time as I need. Thank you for taking the time to check this out!

