package org.example;

import org.example.entity.Student;
import org.example.entity.StudentDetails;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;


public class Main {
    public static void main(String[] args) {
            Configuration config=new Configuration();
            config.configure();
            SessionFactory sessionFactory= config.buildSessionFactory();
            Session session=sessionFactory.openSession();

            try{
                session.beginTransaction();
                StudentDetails studentDetails=new StudentDetails();
                studentDetails.setZipCode(388450);
                Student student=new Student();
                student.setStudent_name("DhruvRathod");
                student.setStudentDetails(studentDetails);
                session.persist(student);
                session.getTransaction().commit();
            }
            finally {
                session.close();
                sessionFactory.close();
            }
        }
    }
