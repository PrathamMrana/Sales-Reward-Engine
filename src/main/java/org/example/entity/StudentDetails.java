package org.example.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class StudentDetails {
    @Id@GeneratedValue@Column(name = "StudentDetailsId")
    private long StudentDetailsId;
    @Column
    private int zipCode;

    public long getStudentDetailsId() {
        return StudentDetailsId;
    }

    public void setStudentDetailsId(long studentDetailsId) {
        StudentDetailsId = studentDetailsId;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }
}

