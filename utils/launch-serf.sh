#!/bin/bash
sudo rm /tmp/hosts.serf
sudo rm /tmp/hosts.serf.tmp
touch /tmp/hosts.serf  
touch /tmp/hosts.serf.tmp
sudo serf agent --log-level=DEBUG --discover=cluster --event-handler=/home/adrian/workspace/eyeos/tagsToDns/src/tagsToDns.js
