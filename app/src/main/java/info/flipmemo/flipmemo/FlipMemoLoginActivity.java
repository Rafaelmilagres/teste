package info.flipmemo.flipmemo;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.widget.TextView;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.Profile;
import com.facebook.ProfileTracker;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

import android.widget.Toast;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class FlipMemoLoginActivity extends Activity {
    private TextView flipmemo;
    private LoginButton loginButton;
    private CallbackManager callbackManager;
    private ProfileTracker profile;
    private android.webkit.WebView webView;
    private String nome;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.com_facebook_activity_layout);


        FacebookSdk.sdkInitialize(getApplicationContext());
        callbackManager = CallbackManager.Factory.create();

        setContentView(R.layout.activity_flip_memo_login);

        // esconde a webview
        webView = (android.webkit.WebView) findViewById(R.id.webView);
        webView.setVisibility(View.INVISIBLE);
        webView.getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        // altera a font do Flip Memo
        flipmemo = (TextView) findViewById(R.id.flipMemo);
        Typeface typeFace = Typeface.createFromAsset(getAssets(),"fonts/Quicksand_Bold.otf");
        flipmemo.setTypeface(typeFace);

        profile = new ProfileTracker() {
            @Override
            protected void onCurrentProfileChanged(
                    Profile oldProfile,
                    Profile currentProfile) {
                if(currentProfile != null) {
                    nome = currentProfile.getFirstName() + " " + currentProfile.getLastName();
                    Log.d("Profile", currentProfile.getFirstName() + currentProfile.getLastName());
                    String json = "{'first_name': '" + currentProfile.getFirstName() + "'";
                    json += ", 'middle_name': '" + currentProfile.getMiddleName() + "'";
                    json += ", 'last_name': '" + currentProfile.getLastName() + "'";
                    json += ", 'id': '"+ currentProfile.getId() + "'";
                    json += ", 'link_uri': '" + currentProfile.getLinkUri() + "'";
                    json += ", 'profile_picture_uri' : '" + currentProfile.getProfilePictureUri(256, 256) + "'";
                    json += "}";
                    Log.d("json", json);
                    webView.loadUrl("javascript:profile('" + json + "')");
                }
            }

        };

        loginButton = (LoginButton)findViewById(R.id.login_button);
        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                // exibe o jogo
                webView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onCancel() {
                Toast.makeText(FlipMemoLoginActivity.this, "Cancelou", Toast.LENGTH_SHORT).show();
                Log.d("resultado", "cancelou");
            }

            @Override
            public void onError(FacebookException e) {
                Toast.makeText(FlipMemoLoginActivity.this, "deu erro", Toast.LENGTH_SHORT).show();
                Log.d("resultado", "erro");
            }
        });



        webView.setWebChromeClient(new WebChromeClient());
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            // Faz com que links externos sejam abertos no app default do sistema
            public boolean shouldOverrideUrlLoading(android.webkit.WebView view, String url) {
                if (url != null) {
                    view.getContext().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));

                    return true;
                } else {
                    return false;
                }
            }
        });

        /*webView.addJavascriptInterface(new WebAppInterface(this), "Android");*/
        /*webView.loadUrl("http://www.mateusferreira.com.br");*/
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    protected void onResume() {
        super.onResume();

        // Logs 'install' and 'app activate' App Events.
        AppEventsLogger.activateApp(this);
    }

    @Override
    protected void onPause() {
        super.onPause();

        // Logs 'app deactivate' App Event.
        AppEventsLogger.deactivateApp(this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }

}
