#!/bin/sh
set -a . ".env.$ENVIRONMENT_NAME" set +a
sleep 10
echo $ENVIRONMENT_NAME
LOCAL="local"
PRODUCTION="production"
if [ $ENVIRONMENT_NAME = $LOCAL ]
then
    npx sequelize-cli db:drop
    npx sequelize-cli db:create
fi
echo "MIGRATING DATABASE"
npx sequelize-cli db:migrate
# seed data for local builds
if [ $ENVIRONMENT_NAME = $LOCAL ]
then
    for file in seeders/*
    do
        :
        npx sequelize-cli db:seed --seed $file
    done
fi
echo "SEEDING DATABASE"
if [ $ENVIRONMENT_NAME = $PRODUCTION ]
then
    for file in seeders/*
    do
        :
        npx sequelize-cli db:seed --seed $file
    done
fi

yarn start