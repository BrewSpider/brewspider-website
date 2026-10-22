---
layout: page
title: Brewing apps
permalink: /brewing-apps/
description: "Send BrewSpider's readings to Brewfather, Brewer's Friend, Grainfather or any app with a webhook."
---

# Brewing apps

BrewSpider can send your readings to the app you plan and log your brews in. In the BrewSpider app, open your device, go to **Advanced → Brewing apps → Connect a brewing app**, pick the app and paste the link it gives you.

Our server does the sending, not the controller: the controller works the same with or without it, and these apps can never control it. The first readings go at once when you connect; if the app refuses them (usually a wrong link), the BrewSpider app shows why. Nothing is sent while the device is offline.

**What is sent:** temperature and target, pressure, gravity and iSpindel battery (with a floating sensor), heating or cooling, and the batch name, under the name you choose (your device's name by default).

The link holds your key for that app, so keep it private. BrewSpider only ever shows its end, and links are removed when you remove the device from your account.

## Brewfather {#brewfather}

1. In [Brewfather](https://brewfather.app/?via=494298), open **Settings → Power-ups → Custom Stream** (needs Brewfather Premium) and copy the link. It starts with *http://log.brewfather.net/stream?id=*.
2. Paste it in the BrewSpider app.
3. Within 15 minutes your device appears under **Devices** in Brewfather; add it to your batch.

Readings go every 15 minutes, the most Brewfather accepts.

## Brewer's Friend {#brewers-friend}

1. In [Brewer's Friend](https://www.brewersfriend.com/), open **Integrations** and copy the **Stream** link (*https://log.brewersfriend.com/stream/…*), or just your API key.
2. Paste it in the BrewSpider app.
3. Link the device to your brew session in Brewer's Friend.

Readings go every 15 minutes, the most Brewer's Friend accepts.

## Grainfather {#grainfather}

1. In the [Grainfather](https://grainfather.com/) app, add a fermentation device of the type **Custom Stream (Webhook)** and copy its link.
2. Paste it in the BrewSpider app.
3. Link the device to your brew session in Grainfather.

Readings go every 15 minutes.

## Webhook: any other app {#webhook}

A webhook is a web address that accepts data. Use it to send BrewSpider's readings to Home Assistant, Node-RED, a Google Sheets script, Zapier or your own server.

1. In the other app, create a webhook (some call it "Catch hook" or "HTTP in") that accepts a **POST** with **JSON**, and copy its address. It must start with **https://**.
2. In the BrewSpider app, choose **Other app (webhook)**, paste the address and choose how often: every 1, 5, 15 or 30 minutes, or every hour.
3. Each reading arrives as one JSON message like this:

```json
{
  "source": "BrewSpider",
  "device_id": "bs-24ec4a1b7f30",
  "name": "Fermenter 1",
  "time": "2026-10-22T18:30:00+00:00",
  "temp_c": 12.3,
  "temp_target_c": 12.0,
  "temp_wired_c": 13.0,
  "temp_ispindel_c": 12.3,
  "pressure_bar": 0.99,
  "pressure_target_bar": 1.0,
  "gravity": 1.042,
  "gravity_unit": "SG",
  "battery_v": 4.02,
  "heater": false,
  "fridge": true,
  "vent": false,
  "brewing": true,
  "batch": "Autumn lager"
}
```

| Field | Meaning |
|---|---|
| `temp_c`, `temp_target_c` | The temperature in use and its target (°C) |
| `temp_wired_c`, `temp_ispindel_c` | Each sensor's own reading (°C) |
| `pressure_bar`, `pressure_target_bar` | Pressure and its target (bar) |
| `gravity`, `gravity_unit` | Gravity from the floating sensor, `SG` or `P` (Plato) |
| `battery_v` | The floating sensor's battery (volts) |
| `heater`, `fridge`, `vent` | Whether heating, cooling and the valve are on |
| `brewing`, `batch` | Whether a batch is running, and its name |
| `time` | When the reading was taken (UTC) |

A sensor that isn't fitted or isn't reporting is sent as `null`.

Questions? [Send us a message](/contact/).
