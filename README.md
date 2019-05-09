# Project Voyager
A new and universal file manager built for the way you work, on any platform. (Win, Mac, Linux)

***
**So what does it do?**

Voyager can navigate through your local filesystem and open any file in its default program. It can use an internal clipboard to cut, copy and paste files to new locations. You can also remove files. The entire program works the same exact way on any platform, as long as all dependencies are met and the core Node.js APIs work. The UI is stylish and the engine is designed to be themed. Known platform inconsistencies are listed in the 'Known Issues' section of this article.

* Feedback: siftdevelopment@gmail.com
* Telegram: [t.me/ProjectVoyager](https://t.me/ProjectVoyager)
* Donate: [paypal.me/siftware](https://paypal.me/siftware)
(Please donate if you can, it really helps.)

***
**Project Goal**

Develop the world's most powerful and easiest-to-use file manager in a beautiful, cross-platform environment.

***
**Development Screenshots**

![Dark Mode](https://github.com/TotalChris/ProjectVoyager/blob/master/bin/scr/dark.png?raw=true "Voyager in a beautiful dark mode")

![Light Mode](https://github.com/TotalChris/ProjectVoyager/blob/master/bin/scr/light.png?raw=true "Voyager in an eye-searing (but elegant) light mode")

***
### Building From Source
***

**Manual installation**

To build the current version of Project Voyager, make sure you have these prerequisites installed via your platform's command line:

* node/npm
* git
* Microsoft Visual Studio Build Tools (If you want to test fluent design features)

Then, run:

```
git clone https://github.com/TotalChris/ProjectVoyager.git
```

Next, cd into 'ProjectVoyager' and run:

```
npm i
```

Optionally, if you want to test fluent design features found in the Fluent-UI-Tools.js script (Windows only), run:

```
npm install --global --production windows-build-tools
npm install windows-registry
```

Alternatively, you can install Visual Studio's build tools with Microsoft's VS Installer. If you already have them, just install the windows-registry package. Note that installing windows-build-tools from npm will install an outdated and conflicting VS Installer as of this writing.

After dependencies have been installed, run Voyager with:

```
npm start
```

***
**Usage**

You can exit the window at any time by normal means, including from the command line itself (Ctrl + C), should the window freeze or the controls break.

***
**Known Issues**

- Moving or deleting large files will cause hang which may prompt the user to attempt killing the task. The solution is to rewrite the dumpItems() function to run in a seperate background process, or as an asynchronous process, and report to the user that the file is on its way.
- Theme settings are not saved in any way and always default to Dark Matte upon opening.

***
**Final Words**

If you wish to contribute to Voyager, feel free to do so. I've recently made the code public so anyone can read it or test it. If I manage to get back to you on an issue or pull request, consider yourself lucky. Git is something I'm still learning, and being a teenager still in high school, I never have as much time as I need. Thank you for taking the time to check this out!

