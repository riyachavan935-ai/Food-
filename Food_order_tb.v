`timescale 1ns/1ps

module food_order_tb;

reg order_request;
reg food_available;
reg cancel_order;

wire order_accepted;
wire order_cancelled;
wire [1:0] order_status;

food_order uut(
    .order_request(order_request),
    .food_available(food_available),
    .cancel_order(cancel_order),
    .order_accepted(order_accepted),
    .order_cancelled(order_cancelled),
    .order_status(order_status)
);

initial begin
    $dumpfile("food_order.vcd");
    $dumpvars(0, food_order_tb);

    $monitor(
        "Time=%0t Request=%b Available=%b Cancel=%b Accepted=%b Cancelled=%b Status=%b",
        $time,
        order_request,
        food_available,
        cancel_order,
        order_accepted,
        order_cancelled,
        order_status
    );

    // Test 1: No order
    order_request = 0;
    food_available = 1;
    cancel_order = 0;
    #10;

    // Test 2: Order accepted
    order_request = 1;
    food_available = 1;
    cancel_order = 0;
    #10;

    // Test 3: Food unavailable
    order_request = 1;
    food_available = 0;
    cancel_order = 0;
    #10;

    // Test 4: Order cancelled
    order_request = 1;
    food_available = 1;
    cancel_order = 1;
    #10;

    $finish;
end

endmodule
