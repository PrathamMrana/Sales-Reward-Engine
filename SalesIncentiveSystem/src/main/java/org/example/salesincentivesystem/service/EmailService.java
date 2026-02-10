package org.example.salesincentivesystem.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Welcome to Sales Reward Engine - Enterprise Edition");

            String htmlContent = """
                        <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
                                <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0;">Sales Reward Engine</h1>
                                </div>
                                <div style="padding: 30px;">
                                    <h2 style="color: #0f172a;">Welcome aboard, %s!</h2>
                                    <p>We are thrilled to have you join our enterprise platform.</p>
                                    <p>Your account has been successfully created. You can now access your dashboard to view your incentives, track performance, and manage your deals.</p>

                                    <div style="margin: 30px 0; text-align: center;">
                                        <a href="http://localhost:5173/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Dashboard</a>
                                    </div>

                                    <p>If you have any questions, our support team is available 24/7.</p>
                                    <br>
                                    <p>Best regards,<br>The Sales Reward Engine Team</p>
                                </div>
                                <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
                                    &copy; 2026 Sales Reward Engine. All rights reserved.
                                </div>
                            </div>
                        </body>
                        </html>
                    """
                    .formatted(name);

            helper.setText(htmlContent, true);

            // In a real app, you would configure this in application.properties
            // helper.setFrom("noreply@salesrewardengine.com");

            mailSender.send(message);
            System.out.println("Welcome email sent to " + to);

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Don't block registration if email fails
        }
    }
}
