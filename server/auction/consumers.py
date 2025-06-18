# auction/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class AuctionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.item_id = self.scope["url_route"]["kwargs"]["item_id"]
        self.room_group_name = f"auction_{self.item_id}"

        # Add user to auction room
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from auction room
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        bid_amount = data["bid"]
        bidder = data["bidder"]

        # Send bid update to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "bid_update",
                "bid": bid_amount,
                "bidder": bidder,
            },
        )

    async def bid_update(self, event):
        bid_amount = event["bid"]
        bidder = event["bidder"]

        # Send bid to WebSocket
        await self.send(
            text_data=json.dumps({"bid": bid_amount, "bidder": bidder})
        )
