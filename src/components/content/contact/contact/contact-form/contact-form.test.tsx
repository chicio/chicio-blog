import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { ContactForm } from "./index";

describe("ContactForm", () => {
    describe("render", () => {
        it("renders the name field", () => {
            render(<ContactForm trackingCategory="test" />);
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        });

        it("renders the email field", () => {
            render(<ContactForm trackingCategory="test" />);
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        });

        it("renders the message field", () => {
            render(<ContactForm trackingCategory="test" />);
            expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        });

        it("keeps the honeypot field in the DOM but out of the accessibility tree", () => {
            const { container } = render(<ContactForm trackingCategory="test" />);
            const honeypot = container.querySelector('input[name="website"]');
            expect(honeypot).toBeInTheDocument();
            expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
        });

        it("renders the Send Message button", () => {
            render(<ContactForm trackingCategory="test" />);
            expect(screen.getByText("Send Message")).toBeInTheDocument();
        });

        it("renders the Reset button", () => {
            render(<ContactForm trackingCategory="test" />);
            expect(screen.getByText("Reset")).toBeInTheDocument();
        });
    });

    describe("validation", () => {
        it("shows error when submitting with empty fields", async () => {
            render(<ContactForm trackingCategory="test" />);
            await userEvent.click(screen.getByText("Send Message"));
            expect(await screen.findByText(/form incomplete/i)).toBeInTheDocument();
        });
    });

    describe("user input", () => {
        it("updates name field value on input", async () => {
            render(<ContactForm trackingCategory="test" />);
            const nameInput = screen.getByLabelText(/name/i);
            await userEvent.type(nameInput, "Fabrizio");
            expect(nameInput).toHaveValue("Fabrizio");
        });

        it("updates email field value on input", async () => {
            render(<ContactForm trackingCategory="test" />);
            const emailInput = screen.getByLabelText(/email/i);
            await userEvent.type(emailInput, "test@example.com");
            expect(emailInput).toHaveValue("test@example.com");
        });
    });
});
