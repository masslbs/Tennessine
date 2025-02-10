<!--
SPDX-FileCopyrightText: 2024 Mass Labs

SPDX-License-Identifier: MIT
-->

## Relay Client

A TS library that implements a basic relay client. This is designed to handle
commincation to and from the relay, by encoding and decoding messages to and
from the relay.

## Usage

1. connect: Create a websocket connection to the relay.
2. authenticate: Send an authentication request to the relay.
3. enrollKeycard: Enroll keycard that will be used for signing messages to send
   shop events.
4. sendMerchantSubscriptionRequest: Send a subscription request to the relay to
   write and receive all events.
