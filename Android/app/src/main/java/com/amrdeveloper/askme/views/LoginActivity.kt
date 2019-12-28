package com.amrdeveloper.askme.views

import android.content.Intent
import android.os.Bundle
import android.widget.Toast

import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.amrdeveloper.askme.R
import com.amrdeveloper.askme.models.LoginData
import com.amrdeveloper.askme.databinding.ActivityLoginBinding
import com.amrdeveloper.askme.utils.Session
import com.amrdeveloper.askme.extensions.*
import com.amrdeveloper.askme.viewmodels.LoginViewModel

class LoginActivity : AppCompatActivity() {

    private lateinit var mLoginViewModel : LoginViewModel
    private lateinit var mLoginActivity: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mLoginActivity = DataBindingUtil.setContentView(this, R.layout.activity_login)
        mLoginViewModel = ViewModelProviders.of(this).get(LoginViewModel::class.java)

        mLoginActivity.registerTxt.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
            finish()
        }

        mLoginActivity.loginButton.setOnClickListener {
            val email: String = mLoginActivity.emailInputEdit.text.toString()
            val password: String = mLoginActivity.passInputEdit.text.toString()
            val loginData = LoginData(email, password)

            if(loginData.isValidLoginInfo()){
                mLoginViewModel.userLogin(loginData)
                mLoginActivity.loadingBar.show()
                return@setOnClickListener
            }

            if(loginData.isValidEmail().not()){
                mLoginActivity.emailInputLayout.error = "Invalid Email"
            }

            if(loginData.isValidPassword().not()){
                mLoginActivity.passInputLayout.error = "Invalid Password"
            }
        }

        mLoginViewModel.getSessionLiveData().observe(this, Observer {
            mLoginActivity.loadingBar.gone()
            if(it != null){
                val session = Session()
                val email: String = mLoginActivity.emailInputEdit.text.str()
                val password: String = mLoginActivity.passInputEdit.text.str()
                session.login(applicationContext, it.userId, email, password, it.authToken)

                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            }else{
                Toast.makeText(this, "Invalid Login", Toast.LENGTH_SHORT).show()
            }
        })
    }
}

