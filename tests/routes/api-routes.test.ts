import { beforeEach, describe, expect, it, vi } from "vitest";

const mockQueryFindUnique = vi.fn();
const mockQueryRunCreate = vi.fn();
const mockQueryRunFindUnique = vi.fn();

const mockCollectQueueAdd = vi.fn();

vi.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    query: {
      findUnique: mockQueryFindUnique,
    },
    queryRun: {
      create: mockQueryRunCreate,
      findUnique: mockQueryRunFindUnique,
    },
  },
}));

vi.mock("@/lib/queue", () => ({
  collectQueue: {
    add: mockCollectQueueAdd,
  },
  defaultJobOpts: {},
}));

describe("POST /api/follow/queries/[id]/run", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects invalid ids", async () => {
    const res = await import("@/app/api/follow/queries/[id]/run/route").then(
      ({ POST }) =>
        POST(new Request("http://localhost"), {
          params: Promise.resolve({ id: "" }),
        })
    );

    expect(res.status).toBe(400);
  });

  it("rejects missing queries", async () => {
    mockQueryFindUnique.mockResolvedValueOnce(null);
    const res = await import("@/app/api/follow/queries/[id]/run/route").then(
      ({ POST }) =>
        POST(new Request("http://localhost"), {
          params: Promise.resolve({ id: "foo" }),
        })
    );

    expect(res.status).toBe(404);
  });

  it("enqueues when query exists", async () => {
    mockQueryFindUnique.mockResolvedValueOnce({ id: "foo", enabled: true });
    mockQueryRunCreate.mockResolvedValueOnce({ id: "run-1" });
    mockCollectQueueAdd.mockResolvedValueOnce(undefined);

    const res = await import("@/app/api/follow/queries/[id]/run/route").then(
      ({ POST }) =>
        POST(new Request("http://localhost"), {
          params: Promise.resolve({ id: "foo" }),
        })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ runId: "run-1" });
    expect(mockCollectQueueAdd).toHaveBeenCalledWith(
      "collect",
      { runId: "run-1", queryId: "foo" },
      {}
    );
  });
});

describe("GET /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects invalid ids", async () => {
    const res = await import("@/app/api/tasks/[id]/route").then(({ GET }) =>
      GET(new Request("http://localhost"), {
        params: Promise.resolve({ id: "" }),
      })
    );

    expect(res.status).toBe(400);
  });

  it("rejects unknown runs", async () => {
    mockQueryRunFindUnique.mockResolvedValueOnce(null);
    const res = await import("@/app/api/tasks/[id]/route").then(({ GET }) =>
      GET(new Request("http://localhost"), {
        params: Promise.resolve({ id: "run-x" }),
      })
    );

    expect(res.status).toBe(404);
  });

  it("returns run when found", async () => {
    mockQueryRunFindUnique.mockResolvedValueOnce({
      id: "run-x",
      status: "SUCCEEDED",
      query: { id: "foo" },
    });

    const res = await import("@/app/api/tasks/[id]/route").then(({ GET }) =>
      GET(new Request("http://localhost"), {
        params: Promise.resolve({ id: "run-x" }),
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("run-x");
  });
});
