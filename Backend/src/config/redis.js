const redis = require('redis');

const redisClient=redis.createClient({
    //Redis Cloud typically uses "default" as username
    username:'default',
    //password for authentication
    password:process.env.REDIS_PASS,

    /*
      - `socket`: An object that specifies the connection details.
    - `host`: The hostname of the Redis server. Here, it's a specific domain provided by Redis Cloud (hosted on AWS in the ap-south-1 region).
    - `port`: The port number (19934) on which the Redis server is listening.*/
    socket:{
        host: 'redis-10893.c89.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 10893
    }
});

module.exports=redisClient;


