function mouse_click(canvas, event)
{
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    engine.mouse.position.x = x;
    engine.mouse.position.y = y;
    engine.mouse.event = event;
}

function collision_point_rect( point, rect )
{
    console.log("x: " + point.x + " y: " + point.y)
    console.log("x: " + rect.x + " y: " + rect.y + " w: "+ rect.w + " h: " + rect.h)
    if( point.x < rect.x + rect.w &&
        point.x > rect.x &&
        point.y < rect.y + rect.h &&
        point.y > rect.y )
        {
            return true;
        }
    return false;
}