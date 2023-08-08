cd doxa-board-dev/
git pull
docker stop doxa-board || true
docker rm doxa-board || true
docker build -t doxa-board .
docker run --name doxa-board -d -p 3000:3000 doxa-board
pause