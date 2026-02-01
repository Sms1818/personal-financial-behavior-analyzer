package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseId;
import com.sahil.pfba.domain.TransactionType;

@Repository
@Profile("prod")
public interface ExpenseJPARepository extends JpaRepository<Expense, ExpenseId> {
    @Query("""
                select e from Expense e
                where e.user.id = :userId
                and e.status = 'ACTIVE'
                and e.version = (
                    select max(e2.version)
                    from Expense e2
                    where e2.id = e.id
                    and e2.user.id = :userId
                )
                order by e.createdAt desc
            """)
    List<Expense> findAllByUser(String userId);

    @Query("""
                select e from Expense e
                where e.id = :expenseId
                and e.user.id = :userId
                and e.version = (
                    select max(e2.version)
                    from Expense e2
                    where e2.id = :expenseId
                    and e2.user.id = :userId
                )
            """)
    Optional<Expense> findLatestById(
            String userId,
            String expenseId);

    @Query("""
                select e from Expense e
                where e.id = :expenseId
                and e.user.id = :userId
                order by e.version asc
            """)
    List<Expense> findHistoryById(
            String userId,
            String expenseId);

    @Query("""
                select e from Expense e
                where e.category = :category
                and e.user.id = :userId
                and e.status = 'ACTIVE'
                and e.version = (
                    select max(e2.version)
                    from Expense e2
                    where e2.id = e.id
                    and e2.user.id = :userId
                )
            """)
    List<Expense> findLatestByCategory(
            String userId,
            Category category);

    @Query("""
                select e from Expense e
                where e.user.id = :userId
                and e.date between :start and :end
                and e.status = 'ACTIVE'
                and e.version = (
                    select max(e2.version)
                    from Expense e2
                    where e2.id = e.id
                    and e2.user.id = :userId
                )
            """)
    List<Expense> findByDateRange(
            String userId,
            LocalDate start,
            LocalDate end);

    @Query("""
                select e from Expense e
                where e.transactionType = :type
                and e.user.id = :userId
                and e.status = 'ACTIVE'
                and e.version = (
                    select max(e2.version)
                    from Expense e2
                    where e2.id = e.id
                    and e2.user.id = :userId
                )
            """)
    List<Expense> findByType(
            String userId,
            TransactionType type);

}
