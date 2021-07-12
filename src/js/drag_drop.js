const drop_zones = ["main", "extra", "side", "card-list"]

function onDragOver(event) {
    event.preventDefault();
}

function onDragStart(event, card) {
    const item = JSON.stringify(card);
    event.dataTransfer.setData('item', item);
    event.dataTransfer.setData('id', event.target.id);
}

function onDrop(event) {
    event.preventDefault();
    event.dataTransfer.clearData();
}

export default {onDragOver, onDragStart, onDrop, drop_zones}