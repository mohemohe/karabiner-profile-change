karabiner-profile-change
----

A simple daemon that changes profile of Karabiner-Elements based on foreground applications.

## require

- [PM2](https://pm2.keymetrics.io/)

## quickstart

```bash
yarn

# edit config.json if need

yarn start

# optional below
pm2 save
pm2 startup
```

You should grant accessibility permission if you see below message in `pm2 logs`.

```
active-win requires the accessibility permission in “System Preferences › Security & Privacy › Privacy › Accessibility”
```

## config structure

```json
{
  "App Name": "Karabiner Profile Name"
}
```

`"_"` is default (fallback) profile name.

```json
{
  "_": "Default Profile",
  "Parallels Desktop": "PC",
  "Parsec": "PC"
}
```

## license

This application includes Twemoji.
https://github.com/twitter/twemoji/blob/master/LICENSE
