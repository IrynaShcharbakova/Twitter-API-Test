<?php


class TwitterOauthSettings
{
/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
private $settings = array(
    'oauth_access_token' => "CHANGE_ME",
    'oauth_access_token_secret' => "CHANGE_ME",
    'consumer_key' => "CHANGE_ME",
    'consumer_secret' => "CHANGE_ME"
);

    public function getSettings()
    {
        return $this->settings;
    }
 } 
?>
