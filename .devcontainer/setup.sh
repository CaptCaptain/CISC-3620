if [ ! -d ".git" ]; then
  git init
  git remote add origin "https://github.com/CaptCaptain/CISC-3620.git"
  git fetch
  git reset --hard origin/main
  git branch --set-upstream-to=origin/main
fi