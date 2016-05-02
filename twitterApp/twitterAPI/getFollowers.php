<?php
ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');
require_once('TwitterOauthSettings.php');

$twitterOauthSettings = new TwitterOauthSettings();
$settings = $twitterOauthSettings->getSettings();

$userId = $_GET['userId'];
$url = 'https://api.twitter.com/1.1/followers/list.json';
$getfield = '?count=50&user_id='.$userId;
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();
