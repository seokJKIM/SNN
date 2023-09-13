package com.ssafy.membermanage.memberHateIngredient.db;

import com.ssafy.membermanage.member.db.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class HateIngredient{
    @Id
    @Column(name = "member_hate_ingredient_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer hateIngredientTblId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "hate_ingredient_id", nullable = false)
    private Short ingredientId;
}
