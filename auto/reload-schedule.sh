#!/bin/bash -eu

cp ~/src/andyriffic/cnb-next/launchd/com.andrewbell.deploytest.plist ~/Library/LaunchAgents
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.andrewbell.deploytest.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.andrewbell.deploytest.plist