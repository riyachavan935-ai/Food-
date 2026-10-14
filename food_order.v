`timescale 1ns/1ps

module food_order(
    input order_request,
    input food_available,
    input cancel_order,
    output order_accepted,
    output order_cancelled,
    output [1:0] order_status
);

assign order_accepted =
    order_request & food_available & ~cancel_order;

assign order_cancelled =
    order_request & cancel_order;

assign order_status =
    order_cancelled ? 2'b11 :
    order_accepted  ? 2'b01 :
                      2'b00;

endmodule
