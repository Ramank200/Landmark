import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import BundleManager from "../components/SellerDashboard/BundleManager";

const mockStore = configureStore([thunk]);

describe("BundleManager", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      bundles: {
        items: [
          {
            _id: "b1",
            name: "Test Bundle",
            products: [
              { _id: "p1", name: "Product 1" },
              { _id: "p2", name: "Product 2" },
            ],
          },
        ],
        status: "idle",
        error: null,
        page: 1,
        totalPages: 1,
        totalBundles: 1,
      },
      products: {
        items: [
          { _id: "p1", name: "Product 1" },
          { _id: "p2", name: "Product 2" },
        ],
      },
      user: { user: { _id: "u1", isSeller: true } },
    });
    store.dispatch = jest.fn();
  });

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <BundleManager />
      </Provider>
    );
    expect(screen.getByText(/Bundle Manager/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    store = mockStore({
      ...store.getState(),
      bundles: { ...store.getState().bundles, status: "loading" },
    });
    render(
      <Provider store={store}>
        <BundleManager />
      </Provider>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    store = mockStore({
      ...store.getState(),
      bundles: { ...store.getState().bundles, error: "Failed to load" },
    });
    render(
      <Provider store={store}>
        <BundleManager />
      </Provider>
    );
    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });

  it("renders a bundle and its products", () => {
    render(
      <Provider store={store}>
        <BundleManager />
      </Provider>
    );
    expect(screen.getByText("Test Bundle")).toBeInTheDocument();
    expect(screen.getByText(/Product 1, Product 2/)).toBeInTheDocument();
  });

  it("can click Edit and Delete buttons", async () => {
    render(
      <Provider store={store}>
        <BundleManager />
      </Provider>
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(store.dispatch).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Delete"));
    // Confirm dialog is shown (simulate confirm)
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText("Delete"));
    expect(store.dispatch).toHaveBeenCalled();
  });

  it("shows pagination if more than one page", () => {
    store = mockStore({
      ...store.getState(),
      bundles: { ...store.getState().bundles, totalPages: 2 },
    });
    render(
      <Provider store={store}>
        <BundleManager />
      </Provider>
    );
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    expect(screen.getByText(/Next/)).toBeInTheDocument();
  });
});
