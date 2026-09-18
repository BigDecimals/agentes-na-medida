package dev.agentesnamedida.orders;

record Command(String action, Status status, int limit) {
    enum Status { AWAITING_SHIPMENT, SHIPPED, CANCELLED, PENDING_PAYMENT }

    static Command parse(String[] args) {
        if (args.length == 1 && (args[0].equals("schema") || args[0].equals("list"))) {
            return new Command(args[0], null, 0);
        }
        if (args.length != 5 || !args[0].equals("search")
                || !args[1].equals("--status") || !args[3].equals("--limit")) {
            throw new IllegalArgumentException();
        }
        var status = Status.valueOf(args[2]);
        int limit = Integer.parseInt(args[4]);
        if (limit < 1 || limit > 10) throw new IllegalArgumentException();
        return new Command("search", status, limit);
    }
}
